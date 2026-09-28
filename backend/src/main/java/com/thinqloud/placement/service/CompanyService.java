package com.thinqloud.placement.service;

import com.thinqloud.placement.dto.CompanyDTO;
import com.thinqloud.placement.entity.Company;
import com.thinqloud.placement.exception.BusinessException;
import com.thinqloud.placement.exception.ResourceNotFoundException;
import com.thinqloud.placement.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(CompanyDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CompanyDTO getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return CompanyDTO.fromEntity(company);
    }

    @Transactional
    public CompanyDTO createCompany(CompanyDTO dto) {
        if (companyRepository.existsByName(dto.getName())) {
            throw new BusinessException("Company with name '" + dto.getName() + "' already exists");
        }

        Company company = new Company();
        company.setName(dto.getName());
        company.setIndustry(dto.getIndustry());
        company.setWebsite(dto.getWebsite());
        company.setContactEmail(dto.getContactEmail());
        company.setContactPhone(dto.getContactPhone());
        company.setLocation(dto.getLocation());
        company.setDescription(dto.getDescription());

        company = companyRepository.save(company);
        return CompanyDTO.fromEntity(company);
    }

    @Transactional
    public CompanyDTO updateCompany(Long id, CompanyDTO dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));

        if (!company.getName().equalsIgnoreCase(dto.getName()) && companyRepository.existsByName(dto.getName())) {
            throw new BusinessException("Company with name '" + dto.getName() + "' already exists");
        }

        company.setName(dto.getName());
        company.setIndustry(dto.getIndustry());
        company.setWebsite(dto.getWebsite());
        company.setContactEmail(dto.getContactEmail());
        company.setContactPhone(dto.getContactPhone());
        company.setLocation(dto.getLocation());
        company.setDescription(dto.getDescription());

        company = companyRepository.save(company);
        return CompanyDTO.fromEntity(company);
    }

    @Transactional
    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        companyRepository.delete(company);
    }
}
