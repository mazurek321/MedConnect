namespace MedConnect.Backend.Models;

public enum TriageColor { Unknown, Green, Yellow, Red }
public class Patient
{
    public Patient(){}
    private Patient(
        Guid id,
        string name, 
        string lastname, 
        string pesel, 
        int? heartRate, 
        int? sbp, 
        string? symptoms, 
        TriageColor? color,
        DateTime registrationTime,
        Guid? userId
    )
    {
        Id = id;
        Name = name;
        Lastname = lastname;
        Pesel = pesel;
        HeartRate = heartRate;
        SystolicBloodPressure = sbp;
        Symptoms = symptoms;
        Color = color;
        RegistrationTime = registrationTime;
        UserId = userId;
    }

    public Guid Id {get; private set;}
    public string Name { get; private set; } = string.Empty;
    public string Lastname { get; private set; } = string.Empty;
    public string Pesel { get; private set; } = string.Empty;
    public int? HeartRate { get; private set; }
    public int? SystolicBloodPressure { get; private set; }
    public string? Symptoms { get; private set; } = string.Empty;
    public TriageColor? Color { get; private set; }
    public DateTime RegistrationTime { get; private set; } 
    public Guid? UserId { get; private set; }
    public User? User { get; private set; }

    public static Patient NewPatient(
        string name, string lastname, string pesel, int? heartRate = null, int? sbp = null, string? symptoms = null, TriageColor? color = TriageColor.Unknown, Guid? userId = null
    )
    {
        return new Patient(
            Guid.NewGuid(), name, lastname, pesel, heartRate, sbp, symptoms ?? "not specified", color, DateTime.UtcNow, userId
        );
    }

    public void UpdatePatient(
        string name, string lastname, string pesel, int? heartRate = null, int? sbp = null, string? symptoms = null, TriageColor? color = TriageColor.Unknown
    )
    {
        Name = name;
        Lastname = lastname;
        Pesel = pesel;
        HeartRate = heartRate;
        SystolicBloodPressure = sbp;
        Symptoms = symptoms;
        Color = color;
    }

    public void LinkUserAccount(Guid userId)
    {
        if (UserId != null) throw new InvalidOperationException("This patient already has an account.");
        UserId = userId;
    }
}