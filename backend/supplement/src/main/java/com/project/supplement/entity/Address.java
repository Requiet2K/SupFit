package com.project.supplement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import jakarta.persistence.*;

import javax.validation.constraints.Size;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "Address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "is_default", columnDefinition = "boolean default false")
    private boolean isDefault;

    private String title;

    @Column(name = "recipient_first_name")
    private String recipientFirstName;

    @Column(name = "recipient_last_name")
    private String recipientLastName;

    @Size(min = 10, max = 10)
    @Column(name = "recipient_phone_number", length = 12)
    private String recipientPhoneNumber;

    private String country;

    private String city;

    private String district;

    private String address;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;
}
