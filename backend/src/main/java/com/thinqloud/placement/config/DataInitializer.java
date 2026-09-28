package com.thinqloud.placement.config;

import com.thinqloud.placement.entity.*;
import com.thinqloud.placement.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewStageRepository interviewRepository;
    private final PlacementRepository placementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           CompanyRepository companyRepository,
                           PlacementDriveRepository driveRepository,
                           ApplicationRepository applicationRepository,
                           InterviewStageRepository interviewRepository,
                           PlacementRepository placementRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.placementRepository = placementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Create Admin User
        User admin = new User("admin@placement.com", passwordEncoder.encode("Admin@123"), Role.ROLE_ADMIN);
        userRepository.save(admin);

        // 2. Create Student Users & Profiles
        User u1 = userRepository.save(new User("john.cse@placement.com", passwordEncoder.encode("Student@123"), Role.ROLE_STUDENT));
        Student s1 = new Student();
        s1.setUser(u1);
        s1.setRollNumber("2026CS101");
        s1.setFullName("John Doe");
        s1.setDepartment("CSE");
        s1.setCgpa(8.75);
        s1.setActiveBacklogs(0);
        s1.setGraduationYear(2026);
        s1.setPhone("+91 9876543210");
        s1.setSkills("Java, Spring Boot, React, PostgreSQL, Docker");
        studentRepository.save(s1);

        User u2 = userRepository.save(new User("sarah.it@placement.com", passwordEncoder.encode("Student@123"), Role.ROLE_STUDENT));
        Student s2 = new Student();
        s2.setUser(u2);
        s2.setRollNumber("2026IT102");
        s2.setFullName("Sarah Jenkins");
        s2.setDepartment("IT");
        s2.setCgpa(7.60);
        s2.setActiveBacklogs(0);
        s2.setGraduationYear(2026);
        s2.setPhone("+91 9876543211");
        s2.setSkills("JavaScript, React, Node.js, Python, SQL");
        studentRepository.save(s2);

        User u3 = userRepository.save(new User("alex.ece@placement.com", passwordEncoder.encode("Student@123"), Role.ROLE_STUDENT));
        Student s3 = new Student();
        s3.setUser(u3);
        s3.setRollNumber("2026EC103");
        s3.setFullName("Alex Rivera");
        s3.setDepartment("ECE");
        s3.setCgpa(6.40);
        s3.setActiveBacklogs(1);
        s3.setGraduationYear(2026);
        s3.setPhone("+91 9876543212");
        s3.setSkills("C++, Embedded C, IoT, Python");
        studentRepository.save(s3);

        User u4 = userRepository.save(new User("rachel.mech@placement.com", passwordEncoder.encode("Student@123"), Role.ROLE_STUDENT));
        Student s4 = new Student();
        s4.setUser(u4);
        s4.setRollNumber("2026ME104");
        s4.setFullName("Rachel Green");
        s4.setDepartment("MECH");
        s4.setCgpa(8.20);
        s4.setActiveBacklogs(0);
        s4.setGraduationYear(2026);
        s4.setPhone("+91 9876543213");
        s4.setSkills("AutoCAD, MATLAB, SolidWorks, Python");
        studentRepository.save(s4);

        // 3. Create Companies
        Company c1 = new Company();
        c1.setName("Thinqloud Solutions");
        c1.setIndustry("Cloud & Enterprise Software");
        c1.setWebsite("https://thinqloud.com");
        c1.setContactEmail("careers@thinqloud.com");
        c1.setContactPhone("+91 20 6789 0000");
        c1.setLocation("Pune / Bangalore");
        c1.setDescription("Leading digital transformation and cloud innovations consulting partner.");
        c1 = companyRepository.save(c1);

        Company c2 = new Company();
        c2.setName("Amazon Web Services");
        c2.setIndustry("Cloud Computing & AI");
        c2.setWebsite("https://aws.amazon.com");
        c2.setContactEmail("campus-hiring@amazon.com");
        c2.setContactPhone("+1 206 266 1000");
        c2.setLocation("Hyderabad / Bangalore");
        c2.setDescription("World leader in hyperscale cloud computing and enterprise platforms.");
        c2 = companyRepository.save(c2);

        Company c3 = new Company();
        c3.setName("Microsoft India");
        c3.setIndustry("Software & Cloud");
        c3.setWebsite("https://microsoft.com");
        c3.setContactEmail("india-recruiting@microsoft.com");
        c3.setContactPhone("+91 80 4010 3000");
        c3.setLocation("Bangalore / Noida");
        c3.setDescription("Empowering every person and organization on the planet to achieve more.");
        c3 = companyRepository.save(c3);

        // 4. Create Placement Drives with Eligibility
        PlacementDrive d1 = new PlacementDrive();
        d1.setCompany(c1);
        d1.setTitle("Thinqloud Graduate Software Engineer 2026");
        d1.setJobRole("Software Development Engineer");
        d1.setJobDescription("Build modern cloud-native architectures using Java Spring Boot, React, and AWS.");
        d1.setPackageLpa(10.5);
        d1.setLocation("Pune / Hybrid");
        d1.setDeadline(LocalDate.now().plusDays(14));
        d1.setDriveDate(LocalDate.now().plusDays(20));
        d1.setStatus(DriveStatus.OPEN);

        EligibilityCriteria ec1 = new EligibilityCriteria();
        ec1.setAllowedDepartments("CSE,IT");
        ec1.setMinCgpa(7.0);
        ec1.setMaxBacklogs(0);
        ec1.setGraduationYear(2026);
        d1.setEligibilityCriteria(ec1);
        d1 = driveRepository.save(d1);

        PlacementDrive d2 = new PlacementDrive();
        d2.setCompany(c2);
        d2.setTitle("AWS Cloud Operations Associate 2026");
        d2.setJobRole("Cloud Support Associate");
        d2.setJobDescription("Support enterprise clients with cloud infrastructure, networking, and system diagnostics.");
        d2.setPackageLpa(8.2);
        d2.setLocation("Hyderabad");
        d2.setDeadline(LocalDate.now().plusDays(21));
        d2.setDriveDate(LocalDate.now().plusDays(28));
        d2.setStatus(DriveStatus.OPEN);

        EligibilityCriteria ec2 = new EligibilityCriteria();
        ec2.setAllowedDepartments("ALL");
        ec2.setMinCgpa(6.0);
        ec2.setMaxBacklogs(1);
        ec2.setGraduationYear(2026);
        d2.setEligibilityCriteria(ec2);
        d2 = driveRepository.save(d2);

        // 5. Seed Demonstration Applications & Interview Stages
        // John Doe applies to Thinqloud -> Passes Technical & HR -> SELECTED -> Placement Created!
        Application app1 = new Application(s1, d1);
        app1.setStatus(ApplicationStatus.SELECTED);
        app1.setRemarks("Top performer across Technical and HR rounds. Issued offer letter.");
        app1 = applicationRepository.save(app1);

        InterviewStage is1_1 = new InterviewStage(app1, "Online Coding Assessment", 1, LocalDateTime.now().minusDays(5));
        is1_1.setStatus(InterviewStatus.PASSED);
        is1_1.setFeedback("Solved 2/2 DSA problems with optimal complexity.");
        interviewRepository.save(is1_1);

        InterviewStage is1_2 = new InterviewStage(app1, "Technical System Design", 2, LocalDateTime.now().minusDays(3));
        is1_2.setStatus(InterviewStatus.PASSED);
        is1_2.setFeedback("Strong grasp of REST APIs, JPA relationships, and concurrency.");
        interviewRepository.save(is1_2);

        InterviewStage is1_3 = new InterviewStage(app1, "HR & Cultural Fit", 3, LocalDateTime.now().minusDays(1));
        is1_3.setStatus(InterviewStatus.PASSED);
        is1_3.setFeedback("Excellent communication and cultural alignment.");
        interviewRepository.save(is1_3);

        Placement p1 = new Placement(s1, d1, c1, 10.5, LocalDate.now());
        placementRepository.save(p1);

        // Sarah applies to Thinqloud -> In INTERVIEW stage (Stage 1 Passed, Stage 2 Pending)
        Application app2 = new Application(s2, d1);
        app2.setStatus(ApplicationStatus.INTERVIEW);
        app2.setRemarks("Passed online assessment. Technical round scheduled.");
        app2 = applicationRepository.save(app2);

        InterviewStage is2_1 = new InterviewStage(app2, "Online Coding Assessment", 1, LocalDateTime.now().minusDays(4));
        is2_1.setStatus(InterviewStatus.PASSED);
        is2_1.setFeedback("Scored 85% on coding fundamentals.");
        interviewRepository.save(is2_1);

        InterviewStage is2_2 = new InterviewStage(app2, "Technical Interview", 2, LocalDateTime.now().plusDays(2));
        is2_2.setStatus(InterviewStatus.PENDING);
        interviewRepository.save(is2_2);

        // Alex applies to AWS -> In SCREENING stage
        Application app3 = new Application(s3, d2);
        app3.setStatus(ApplicationStatus.SCREENING);
        app3.setRemarks("Profile shortlisted for online test.");
        applicationRepository.save(app3);

        // David applies to Thinqloud -> In REJECTED stage (Failed Technical Round)
        User u5 = userRepository.save(new User("david.cse@placement.com", passwordEncoder.encode("Student@123"), Role.ROLE_STUDENT));
        Student s5 = new Student();
        s5.setUser(u5);
        s5.setRollNumber("2026CS105");
        s5.setFullName("David Miller");
        s5.setDepartment("CSE");
        s5.setCgpa(7.10);
        s5.setActiveBacklogs(0);
        s5.setGraduationYear(2026);
        s5.setPhone("+91 9876543215");
        s5.setSkills("C++, Java, SQL");
        studentRepository.save(s5);

        Application app4 = new Application(s5, d1);
        app4.setStatus(ApplicationStatus.REJECTED);
        app4.setRemarks("Did not clear Technical Round 1.");
        app4 = applicationRepository.save(app4);

        InterviewStage is4_1 = new InterviewStage(app4, "Online Coding Assessment", 1, LocalDateTime.now().minusDays(6));
        is4_1.setStatus(InterviewStatus.PASSED);
        is4_1.setFeedback("Cleared basic coding screening.");
        interviewRepository.save(is4_1);

        InterviewStage is4_2 = new InterviewStage(app4, "Technical Interview", 2, LocalDateTime.now().minusDays(2));
        is4_2.setStatus(InterviewStatus.FAILED);
        is4_2.setFeedback("Struggled with core problem solving & system complexity.");
        interviewRepository.save(is4_2);
    }
}
