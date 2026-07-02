using System.ComponentModel.DataAnnotations;

namespace MedConnect.Backend.Models;

public class Interview
{
    public Interview(){}
    private Interview(
        Guid id, 
        Guid patientId,
        bool chestPain,
        bool dyspnea,
        bool abdominalPain,
        bool headache,
        bool cough,
        bool hypertension,
        bool diabetes,
        DateTime timeOfInterview
    )
    {
        Id = id;
        PatientId = patientId;
        ChestPain = chestPain;
        Dyspnea = dyspnea;
        AbdominalPain = abdominalPain;
        Headache = headache;
        Cough = cough;
        Hypertension = hypertension;
        Diabetes = diabetes;
        TimeOfInterview = timeOfInterview;
    }

    [Key]
    public Guid Id { get; private set; }
    public Guid PatientId { get; private set; }
    public bool ChestPain { get; private set; }
    public bool Dyspnea { get; private set; }
    public bool AbdominalPain { get; private set; }
    public bool Headache { get; private set; }
    public bool Cough { get; private set; }
    public bool Hypertension { get; private set; }
    public bool Diabetes { get; private set; }
    public DateTime TimeOfInterview { get; private set; }

    public static Interview NewInterview(
        Guid patientId,
        bool chestPain,
        bool dyspnea,
        bool abdominalPain,
        bool headache,
        bool cough,
        bool hypertension,
        bool diabetes
    )
    {
        return new Interview(Guid.NewGuid(), patientId, chestPain, dyspnea, abdominalPain, headache, cough, hypertension, diabetes, DateTime.UtcNow);
    }
}