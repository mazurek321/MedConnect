using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace MedConnect.Backend.Services;

public interface ICurrentUserContext
{
    Guid? Id { get; }
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
            var idValue = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(idValue, out var id) ? id : null;
        }
    }

    public string? Username => User?.FindFirst(ClaimTypes.Name)?.Value;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;
}