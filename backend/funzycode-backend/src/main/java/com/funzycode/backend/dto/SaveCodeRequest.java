package com.funzycode.backend.dto;

import lombok.Data;

@Data
public class SaveCodeRequest {
    private String submittedCode;
    private Integer secondsLeft;
}
