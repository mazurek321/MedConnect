namespace MedConnect.Backend.DTOs;

public record UpdatePatientDto(
    Guid Id,
    string Name,
    string Lastname,
    string Pesel
);