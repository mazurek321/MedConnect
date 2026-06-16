using MedConnect.Backend.Models;

namespace MedConnect.Backend.DTOs;

public record RegisterStaffDto(
    string Username,
    string Name,
    string Lastname,
    string Password,
    UserRole Role,
    string MedicalLicenseNumber
);