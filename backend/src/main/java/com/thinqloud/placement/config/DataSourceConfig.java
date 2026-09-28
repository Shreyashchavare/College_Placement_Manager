package com.thinqloud.placement.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${DB_HOST:}")
    private String dbHost;

    @Value("${DB_PORT:5432}")
    private String dbPort;

    @Value("${DB_NAME:placement_db}")
    private String dbName;

    @Value("${DB_USERNAME:}")
    private String envUsername;

    @Value("${DB_PASSWORD:}")
    private String envPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        String rawUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DATABASE_URL");
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = datasourceUrl;
        }

        String finalUser = (username != null && !username.isBlank()) ? username : 
                           ((envUsername != null && !envUsername.isBlank()) ? envUsername : System.getenv("DB_USERNAME"));
        String finalPass = (password != null && !password.isBlank()) ? password : 
                           ((envPassword != null && !envPassword.isBlank()) ? envPassword : System.getenv("DB_PASSWORD"));

        if (rawUrl != null && !rawUrl.isBlank()) {
            if (rawUrl.startsWith("jdbc:postgresql://")) {
                config.setJdbcUrl(rawUrl);
            } else if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
                try {
                    String normalized = rawUrl.startsWith("postgresql://") 
                            ? rawUrl.replaceFirst("postgresql://", "http://") 
                            : rawUrl.replaceFirst("postgres://", "http://");
                    URI uri = URI.create(normalized);
                    String host = uri.getHost();
                    int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                    String path = uri.getPath();
                    
                    config.setJdbcUrl("jdbc:postgresql://" + host + ":" + port + path);
                    log.info("Normalized database URL to: jdbc:postgresql://{}:{}{}", host, port, path);
                    
                    if (uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":", 2);
                        if (userInfo.length > 0 && (finalUser == null || finalUser.isBlank())) {
                            finalUser = userInfo[0];
                        }
                        if (userInfo.length > 1 && (finalPass == null || finalPass.isBlank())) {
                            finalPass = userInfo[1];
                        }
                    }
                } catch (Exception e) {
                    String clean = rawUrl.replaceFirst("^(postgres|postgresql)://", "jdbc:postgresql://");
                    config.setJdbcUrl(clean);
                }
            } else {
                config.setJdbcUrl("jdbc:postgresql://" + rawUrl);
            }
        } else if (dbHost != null && !dbHost.isBlank()) {
            config.setJdbcUrl("jdbc:postgresql://" + dbHost + ":" + dbPort + "/" + dbName);
        } else {
            config.setJdbcUrl("jdbc:postgresql://localhost:5432/placement_db");
        }

        if (finalUser != null && !finalUser.isBlank()) {
            config.setUsername(finalUser);
        } else {
            config.setUsername("postgres");
        }

        if (finalPass != null) {
            config.setPassword(finalPass);
        }

        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(30000);
        config.setMaxLifetime(1200000);

        return new HikariDataSource(config);
    }
}
