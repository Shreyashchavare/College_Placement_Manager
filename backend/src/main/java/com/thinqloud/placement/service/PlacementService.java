package com.thinqloud.placement.service;

import com.thinqloud.placement.dto.PlacementDTO;
import com.thinqloud.placement.entity.Application;
import com.thinqloud.placement.entity.Placement;
import com.thinqloud.placement.exception.ResourceNotFoundException;
import com.thinqloud.placement.repository.PlacementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlacementService {

    private final PlacementRepository placementRepository;

    public PlacementService(PlacementRepository placementRepository) {
        this.placementRepository = placementRepository;
    }

    public List<PlacementDTO> getAllPlacements() {
        return placementRepository.findAllByOrderByOfferDateDesc().stream()
                .map(PlacementDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PlacementDTO> getPlacementsByStudent(Long studentId) {
        return placementRepository.findByStudentId(studentId).stream()
                .map(PlacementDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public PlacementDTO getPlacementById(Long id) {
        Placement placement = placementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement record not found with id: " + id));
        return PlacementDTO.fromEntity(placement);
    }

    @Transactional
    public Placement createPlacementFromApplication(Application application) {
        Optional<Placement> existing = placementRepository.findByStudentIdAndPlacementDriveId(
                application.getStudent().getId(), application.getPlacementDrive().getId()
        );

        if (existing.isPresent()) {
            return existing.get();
        }

        Placement placement = new Placement(
                application.getStudent(),
                application.getPlacementDrive(),
                application.getPlacementDrive().getCompany(),
                application.getPlacementDrive().getPackageLpa(),
                LocalDate.now()
        );

        return placementRepository.save(placement);
    }
}
