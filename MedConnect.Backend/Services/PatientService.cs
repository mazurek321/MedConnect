using MedConnect.Backend.DTOs;
using MedConnect.Backend.Models;
using MedConnect.Backend.Repository;

namespace MedConnect.Backend.Services;

public class PatientService
{
    private readonly IPatientRepository _patientRepository;

    public PatientService(IPatientRepository patientRepository)
    {
        _patientRepository = patientRepository;
    }

    public async Task<IEnumerable<Patient>> BrowsePatients() { 
        return await _patientRepository.BrowsePatients(); 
    }

    public async Task<Patient> GetPatient(Guid id)
    {
        var patient = await _patientRepository.GetPatientById(id);

        if(patient is null)
                throw new Exception("Patient not found.");

        return patient;
    }

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

        await _patientRepository.AddAsync(newPatient);

        return newPatient;
    }

    public async Task<Patient> UpdatePatientAsync(UpdatePatientDto dto)
    {
        var patient = await GetPatient(dto.Id);
        
        patient.UpdatePatient(
            dto.Name,
            dto.Lastname,
            dto.Pesel,
            dto.HeartRate,
            dto.SystolicBloodPressure,
            dto.Symptoms
        );

        await _patientRepository.UpdateAsync(patient);

        return patient;
    }

    public async Task<bool> DeletePatientAsync(Guid id)
    {
        var patient = await GetPatient(id);

        await _patientRepository.DeleteAsync(patient);

        return true;
    }
}