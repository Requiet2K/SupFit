package com.project.supplement.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AddressDetails {
    private String title;
    private String recipientFirstName;
    private String recipientLastName;
    private String recipientPhoneNumber;
    private String country;
    private String city;
    private String district;
    private String address;
}

