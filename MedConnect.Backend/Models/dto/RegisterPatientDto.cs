using MedConnect.Backend.Models;

namespace MedConnect.Backend.DTOs;

public record RegisterPatientDto(
    string Name,
    string Lastname,
    Gender Sex,
    DateOnly DateOfBirth,
    string Pesel
);