using MedConnect.Backend.DTOs;
using MedConnect.Backend.Models;
using MedConnect.Backend.Repository;
using HotChocolate.Subscriptions;
using MedConnect.Backend.GraphQL;
using System.Collections.Concurrent;

namespace MedConnect.Backend.Services;

public class PatientService
{
    private readonly IPatientRepository _patientRepository;
    private readonly ITopicEventSender _eventSender;
    private static readonly ConcurrentDictionary<Guid, AlertType> _activePatientAlerts = new();

    public PatientService(IPatientRepository patientRepository, ITopicEventSender eventSender)
    {
        _patientRepository = patientRepository;
        _eventSender = eventSender;
    }

    public async Task<IEnumerable<Patient>> BrowsePatients() 
    { 
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
        var newPatient = Patient.NewPatient(
            dto.Name, dto.Lastname, dto.Pesel
        );

        await _patientRepository.AddAsync(newPatient);
        await _eventSender.SendAsync(nameof(Subscription.OnPatientUpdated), newPatient);

        return newPatient;
    }

    public async Task<Patient> UpdatePatientAsync(UpdatePatientDto dto)
    {
        var patient = await GetPatient(dto.Id);
        
        patient.UpdatePatient(
            dto.Name,
            dto.Lastname,
            dto.Pesel
        );

        await _patientRepository.UpdateAsync(patient);
        await _eventSender.SendAsync(nameof(Subscription.OnPatientUpdated), patient);

        return patient;
    }

    public async Task<bool> DeletePatientAsync(Guid id)
    {
        var patient = await GetPatient(id);

        await _patientRepository.DeleteAsync(patient);

        _activePatientAlerts.TryRemove(id, out _);

        return true;
    }

    public async Task<Patient> UpdateVitalsOfPatientAsync(Guid id, UpdateVitalsDto dto)
    {
        var patient = await _patientRepository.GetPatientById(id);

        if (patient is null)
        {
            throw new Exception("Patient not found!");
        }

        var newVitals = Vitals.NewVitals(
            dto.HeartRate,
            dto.SystolicBloodPressure,
            dto.DiastolicBloodPressure,
            dto.OxygenSaturation,
            dto.Temperature
        );

        var evaluation = EvaluateVitals(newVitals);

        patient.UpdateVitals(newVitals, evaluation.Color);

        await _patientRepository.UpdateAsync(patient);
        await ProcessVitalsAndSendAlertIfNeed(patient, evaluation.AlertLevel, evaluation.Issues);
        
        await _eventSender.SendAsync(nameof(Subscription.OnPatientUpdated), patient);
        
        return patient;
    }

    public async Task ProcessVitalsAndSendAlertIfNeed(Patient patient, AlertType currentHighestAlert, List<string> issues)
    {
        var patientId = patient.Id;

        if (_activePatientAlerts.TryGetValue(patientId, out var previousAlert))
        {
            if ((int)currentHighestAlert <= (int)previousAlert)
            {
                return;
            }
        }

        _activePatientAlerts[patientId] = currentHighestAlert;

        if(currentHighestAlert == AlertType.Warning)
        {
            var notification = Notification.NewNotification(
                topic: $"Warning alert for patient {patient.Name} {patient.Lastname}",
                message: $"Abnormal vital signs detected: {string.Join(", ", issues)}.",
                type: AlertType.Warning,
                reciptientRole: UserRole.Nurse
            );

            string topicName = $"Notifications_For_{UserRole.Nurse}";
            await _eventSender.SendAsync(topicName, notification);
        }
        else if(currentHighestAlert == AlertType.Critical)
        {
            var notification = Notification.NewNotification(
                topic: $"Critical alert for patient {patient.Name} {patient.Lastname}",
                message: $"Critical vital signs detected: {string.Join(", ", issues)}.",
                type: AlertType.Critical,
                reciptientRole: UserRole.Doctor
            );

            string doctorTopic = $"Notifications_For_{UserRole.Doctor}";
            await _eventSender.SendAsync(doctorTopic, notification);

            string nurseTopic = $"Notifications_For_{UserRole.Nurse}";
            await _eventSender.SendAsync(nurseTopic, notification);
        }
    }

    private (AlertType AlertLevel, TriageColor Color, List<string> Issues) EvaluateVitals(Vitals vitals)
    {
        var issues = new List<string>();
        var alertLevel = AlertType.Normal;

        if (vitals.HeartRate < 50 || vitals.HeartRate > 120)
        {
            alertLevel = GetMaxAlert(alertLevel, AlertType.Critical);
            issues.Add($"Critical heart rate: {vitals.HeartRate} bpm (Norma: 60-100)");
        }
        else if (vitals.HeartRate < 60 || vitals.HeartRate > 100)
        {
            alertLevel = GetMaxAlert(alertLevel, AlertType.Warning);
            issues.Add($"Abnormal heart rate: {vitals.HeartRate} bpm");
        }

        if (vitals.OxygenSaturation < 90)
        {
            alertLevel = GetMaxAlert(alertLevel, AlertType.Critical);
            issues.Add($"Critical oxygen saturation: {vitals.OxygenSaturation}% (Norma: >95%)");
        }
        else if (vitals.OxygenSaturation < 95)
        {
            alertLevel = GetMaxAlert(alertLevel, AlertType.Warning);
            issues.Add($"Low oxygen saturation: {vitals.OxygenSaturation}%");
        }

        if (vitals.Temperature < 35.0 || vitals.Temperature > 39.0)
        {
            alertLevel = GetMaxAlert(alertLevel, AlertType.Critical);
            issues.Add($"Critical temperature: {vitals.Temperature}°C");
        }
        else if (vitals.Temperature < 36.0 || vitals.Temperature > 37.5)
        {
            alertLevel = GetMaxAlert(alertLevel, AlertType.Warning);
            issues.Add($"Abnormal temperature: {vitals.Temperature}°C");
        }

        if (vitals.SystolicBloodPressure < 90 || vitals.SystolicBloodPressure > 180)
        {
            alertLevel = GetMaxAlert(alertLevel, AlertType.Critical);
            issues.Add($"Critical blood pressure: {vitals.SystolicBloodPressure} mmHg");
        }
        else if (vitals.SystolicBloodPressure < 100 || vitals.SystolicBloodPressure > 140)
        {
            alertLevel = GetMaxAlert(alertLevel, AlertType.Warning);
            issues.Add($"Abnormal blood pressure: {vitals.SystolicBloodPressure} mmHg");
        }

        var color = TriageColor.Green;
        if (alertLevel == AlertType.Critical)
        {
            color = TriageColor.Red;
        }
        else if (alertLevel == AlertType.Warning)
        {
            color = TriageColor.Yellow;
        }

        return (alertLevel, color, issues);
    }

    private AlertType GetMaxAlert(AlertType current, AlertType incoming)
    {
        return (int)incoming > (int)current ? incoming : current;
    }
}