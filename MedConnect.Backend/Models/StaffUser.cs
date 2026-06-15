using Microsoft.AspNetCore.Identity;

namespace MedConnect.Backend.Models;

public enum StaffRole {Doctor, Nurse}
public class StaffUser
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Lastname { get; private set; } = string.Empty;
    public string Pesel { get; private set; } = string.Empty;
    public StaffRole Role { get; private set; }
}