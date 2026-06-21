using System.ComponentModel.DataAnnotations;

namespace MedConnect.Backend.Models;

[InterfaceType("User")]
public abstract class User
{
    protected User(){}

    protected User(
        Guid id, string username, string plainPassword, UserRole role
    )
    {
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword);

        Id = id;
        Username = username;
        PasswordHash = passwordHash;
        Role = role;
    }

    [Key]
    public Guid Id { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }

    public bool VerifyPassword(string plainPassword)
    {
        if (string.IsNullOrEmpty(PasswordHash)) return false;
        return BCrypt.Net.BCrypt.Verify(plainPassword, PasswordHash);
    }

    public void UpdateCredentials(string username, string plainPassword)
    {
        if (string.IsNullOrWhiteSpace(username)) throw new ArgumentException("Username cannot be empty");
        if (plainPassword.Length < 3) throw new ArgumentException("Password must be at least 3 characters long");

        Username = username;
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword);
    }

}