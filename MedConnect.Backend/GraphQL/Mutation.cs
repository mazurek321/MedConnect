using HotChocolate.Authorization;
using MedConnect.Backend.DTOs;
using MedConnect.Backend.Models;
using MedConnect.Backend.Services;

namespace MedConnect.Backend.GraphQL;

public class Mutation
{
    public async Task<string> Login(LoginDto input, [Service] AuthService authService)
    {
        var token = await authService.LoginAsync(input);
        return new string(token);
    }

    public async Task<Staff> RegisterStaff(RegisterStaffDto input, [Service] AuthService authService)
    {
        return await authService.RegisterStaffAsync(input);
    }

    [Authorize(Roles = new[]{nameof(UserRole.Admin), nameof(UserRole.Doctor), nameof(UserRole.Nurse)})]
    public async Task<Patient> RegisterPatient(
        RegisterPatientDto input,
        [Service] PatientService patientService
    )
    {
        return await patientService.AddPatientAsync(input); 
    }

    [Authorize(Roles = new[]{nameof(UserRole.Admin), nameof(UserRole.Doctor), nameof(UserRole.Nurse)})]
    public async Task<Patient> UpdatePatient(
        UpdatePatientDto input,
        [Service] PatientService patientService
    )
    {
        return await patientService.UpdatePatientAsync(input);
    }

    [Authorize(Roles = new[]{nameof(UserRole.Admin), nameof(UserRole.Doctor), nameof(UserRole.Nurse)})]
    public async Task<bool> DeletePatient(
        Guid id,
        [Service] PatientService patientService
    )
    {
        return await patientService.DeletePatientAsync(id);
    }
}