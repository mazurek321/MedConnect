namespace MedConnect.Backend.Models;

public record UpdateVitalsDto(
    int? HeartRate,
    int? SystolicBloodPressure,
    int? DiastolicBloodPressure,
    int? OxygenSaturation,
    double? Temperature
);