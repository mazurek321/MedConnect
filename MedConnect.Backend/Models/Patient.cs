using System.ComponentModel.DataAnnotations;

namespace MedConnect.Backend.Models;

public enum TriageColor { Unknown, Green, Yellow, Red }
public class Patient
{
    public Patient()
    {
        Vitals = new Vitals();
        Interviews = new List<Interview>();
    }
    private Patient(
        Guid id,
        string name, 
        string lastname, 
        Gender sex,
        DateOnly dateOfBirth,
        string pesel, 
        DateTime registrationTime,
        Vitals vitals
    )
    {
        Id = id;
        Name = name;
        Lastname = lastname;
        Sex = sex;
        DateOfBirth = dateOfBirth;
        Pesel = pesel;
        RegistrationTime = registrationTime;
        Vitals = vitals;
        Interviews = new List<Interview>();
    }

    [Key]
    public Guid Id {get; private set;}
    public string Name { get; private set; } = string.Empty;
    public string Lastname { get; private set; } = string.Empty;
    public Gender Sex { get; private set; }
    public DateOnly DateOfBirth { get; private set; }
    public string Pesel { get; private set; } = string.Empty;
    public DateTime RegistrationTime { get; private set; } 
    public Vitals Vitals { get; private set; }
    public ICollection<Interview> Interviews { get; private set; }

    public static Patient NewPatient(
        string name, string lastname, Gender sex, DateOnly dateOfBirth, string pesel
    )
    {
        return new Patient(
            Guid.NewGuid(), name, lastname, sex, dateOfBirth, pesel, DateTime.UtcNow, new Vitals()
        );
    }

    public void UpdatePatient(
        string name, string lastname, string pesel
    )
    {
        Name = name;
        Lastname = lastname;
        Pesel = pesel;
    }

    public void UpdateVitals(
        Vitals newVitals, TriageColor color
    )
    {
        Vitals.UpdateVitals(newVitals, color);
    }

    public void AddInterview(Interview interview)
    {
        Interviews.Add(interview);
    }
}