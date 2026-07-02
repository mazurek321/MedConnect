using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MedConnect.Backend.Repository;
using MedConnect.Backend.Models;
using Microsoft.Extensions.Configuration;
using MedConnect.Backend.DTOs;

namespace MedConnect.Backend.Services;

public class AuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserContext _currentUserRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, ICurrentUserContext currentUserContext, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _currentUserRepository = currentUserContext;
        _configuration = configuration;
    }

    public string GenerateJwtToken(Guid userId, string username, UserRole role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var secretKey = _configuration["JwtSettings:Secret"] ?? "SuperTajnaI_Dluga_Wartosc_Klucza_Do_Podpisywania_JWT_123!";
        var key = Encoding.UTF8.GetBytes(secretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("sub", userId.ToString()),
                new Claim("name", username),
                new Claim("role", role.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(8),
            Issuer = _configuration["JwtSettings:Issuer"] ?? "MedConnectBackend",
            Audience = _configuration["JwtSettings:Audience"] ?? "MedConnectFrontend",
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByUsernameAsync(dto.Username);
        if (user == null || !user.VerifyPassword(dto.Password))
        {
            throw new Exception("Invalid username or password.");
        }

        return GenerateJwtToken(user.Id, user.Username, user.Role);
    }

    public async Task<Staff> RegisterStaffAsync(RegisterStaffDto dto)
    {
        var currentUserRole = _currentUserRepository.Role;
        if(currentUserRole is null)
            throw new Exception("User not logged in.");

        var existingUser = await _userRepository.GetByUsernameAsync(dto.Username);
        if (existingUser != null)
            throw new Exception("Username is already taken.");

        if(dto.Role == UserRole.Admin || dto.Role == UserRole.Doctor && currentUserRole != UserRole.Admin)
            throw new Exception("You dont have permissions to create user with that role.");

        var newStaff = Staff.CreateAccount(dto.Username, dto.Name, dto.Lastname, dto.Password, dto.Role, dto.MedicalLicenseNumber);
        
        await _userRepository.AddAsync(newStaff);

        return newStaff;
    }
}