namespace MedConnect.Backend.Models;

public class Staff : User
{
    public Staff(){}

    private Staff(
         Guid id, string username, string name, string lastname, string plainPassword, UserRole role, string medicalLicenseNumber
    ) : base (id, username, plainPassword, role)
    {
        Name = name;
        Lastname = lastname;
        MedicalLicenseNumber = medicalLicenseNumber;        
    }
    public string Name { get; protected set; } = string.Empty;
    public string Lastname { get; protected set; } = string.Empty;
    public string MedicalLicenseNumber {get; private set; } = string.Empty;

    public static Staff CreateAccount(
        string username, string name, string lastname, string plainPassword, UserRole role, string medicalLicenseNumber
    )
    {
        return new Staff(Guid.NewGuid(), username, name, lastname, plainPassword, role, medicalLicenseNumber);
    }

    public void UpdateProfile(string name, string lastname,string medicalLicenseNumber)
    {
        Name = name;
        Lastname = lastname;
        MedicalLicenseNumber = medicalLicenseNumber;
    }
}