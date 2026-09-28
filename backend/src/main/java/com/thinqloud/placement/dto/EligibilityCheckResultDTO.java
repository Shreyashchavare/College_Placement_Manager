package com.thinqloud.placement.dto;

import java.util.ArrayList;
import java.util.List;

public class EligibilityCheckResultDTO {
    private boolean eligible;
    private boolean departmentEligible;
    private boolean cgpaEligible;
    private boolean backlogsEligible;
    private boolean gradYearEligible;
    private boolean alreadyApplied;
    private List<String> reasons = new ArrayList<>();

    public EligibilityCheckResultDTO() {}

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public boolean isDepartmentEligible() {
        return departmentEligible;
    }

    public void setDepartmentEligible(boolean departmentEligible) {
        this.departmentEligible = departmentEligible;
    }

    public boolean isCgpaEligible() {
        return cgpaEligible;
    }

    public void setCgpaEligible(boolean cgpaEligible) {
        this.cgpaEligible = cgpaEligible;
    }

    public boolean isBacklogsEligible() {
        return backlogsEligible;
    }

    public void setBacklogsEligible(boolean backlogsEligible) {
        this.backlogsEligible = backlogsEligible;
    }

    public boolean isGradYearEligible() {
        return gradYearEligible;
    }

    public void setGradYearEligible(boolean gradYearEligible) {
        this.gradYearEligible = gradYearEligible;
    }

    public boolean isAlreadyApplied() {
        return alreadyApplied;
    }

    public void setAlreadyApplied(boolean alreadyApplied) {
        this.alreadyApplied = alreadyApplied;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}
