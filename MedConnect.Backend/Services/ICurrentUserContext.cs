using System.Security.Claims;
using MedConnect.Backend.Models;
using Microsoft.AspNetCore.Http;

namespace MedConnect.Backend.Services;

public interface ICurrentUserContext
{
    Guid? Id { get; }
    UserRole? Role {get; }
    string? Username { get; }
    bool IsAuthenticated { get; }
}

public class CurrentUserContext : ICurrentUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public Guid? Id
    {
        get
        {
            var idValue = User?.FindFirst("sub")?.Value ?? User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (Guid.TryParse(idValue, out var id))
            {
                return id;
            }
            return null;
        }
    }

    public UserRole? Role
    {
        get
        {
            var roleValue = User?.FindFirst("role")?.Value ?? User?.FindFirst(ClaimTypes.Role)?.Value;

            if (Enum.TryParse<UserRole>(roleValue, true, out var role))
            {
                return role;
            }
            return null;
        }
    }

    public string? Username => User?.FindFirst("name")?.Value ?? User?.FindFirst(ClaimTypes.Name)?.Value;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;
}