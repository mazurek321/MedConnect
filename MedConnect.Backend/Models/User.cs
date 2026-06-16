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

    public Guid Id { get; protected set; }
    public string Username { get; protected set; } = string.Empty;
    public string PasswordHash { get; protected set; } = string.Empty;
    public UserRole Role { get; protected set; }

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