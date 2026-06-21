using System.Drawing;

namespace MedConnect.Backend.Models;

public class Vitals
{
    public Vitals(){}

    private Vitals(int? hr, int? sbp, int? dbp, int? os, double? temp, TriageColor? color)
    {
        HeartRate = hr;
        SystolicBloodPressure = sbp;
        DiastolicBloodPressure = dbp;
        OxygenSaturation = os;
        Temperature = temp;
        Color = color;
    }

    public int? HeartRate { get; private set; }
    public int? SystolicBloodPressure { get; private set; }
    public int? DiastolicBloodPressure { get; private set; }
    public int? OxygenSaturation { get; private set; }
    public double? Temperature { get; private set; }
    public TriageColor? Color { get; private set; }

    public static Vitals NewVitals(int? hr, int? sbp, int? dpb, int? os, double? temp, TriageColor? color = TriageColor.Unknown)
    {
        return new Vitals(hr, sbp, dpb, os, temp, color);
    }

    public void UpdateVitals(Vitals newVitals, TriageColor color)
    {
        HeartRate = newVitals.HeartRate;
        SystolicBloodPressure = newVitals.SystolicBloodPressure;
        DiastolicBloodPressure = newVitals.DiastolicBloodPressure;
        OxygenSaturation = newVitals.OxygenSaturation;
        Temperature = newVitals.Temperature;
        Color = color;
    }
}