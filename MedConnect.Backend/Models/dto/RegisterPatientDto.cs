namespace MedConnect.Backend.DTOs;

public record RegisterPatientDto(
    string Name,
    string Lastname,
    string Pesel
);