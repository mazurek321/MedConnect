using MedConnect.Backend.Data;
using MedConnect.Backend.DTOs;
using MedConnect.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace MedConnect.Backend.Services;

public class PatientService
{
    private readonly AppDbContext _context;

    public PatientService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Patient>> GetAllPatientsAsync() => await _context.Patients.ToListAsync();

    public async Task<Patient> AddPatientAsync(RegisterPatientDto dto)
    {
        var autoColor = TriageColor.Green;
        if (dto.HeartRate == null || dto.SystolicBloodPressure == null)
        {
            autoColor = TriageColor.Unknown;
        }
        else if (dto.HeartRate > 120 || dto.HeartRate < 45 || dto.SystolicBloodPressure < 90) 
        {
            autoColor = TriageColor.Red;
        }
        else if (dto.HeartRate > 100 || dto.SystolicBloodPressure > 150) 
        {
            autoColor = TriageColor.Yellow;
        }

        var newPatient = Patient.NewPatient(
            dto.Name, dto.Lastname, dto.Pesel, dto.HeartRate, dto.SystolicBloodPressure, dto.Symptoms, autoColor
        );

        _context.Patients.Add(newPatient);
        await _context.SaveChangesAsync(); 

        return newPatient;
    }
}