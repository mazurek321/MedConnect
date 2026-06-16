using MedConnect.Backend.Models;
using MedConnect.Backend.Repository;

namespace MedConnect.Backend.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserContext _currentUser;

    public UserService(IUserRepository userRepository, ICurrentUserContext currentUser)
    {
        _userRepository = userRepository;
        _currentUser = currentUser;
    }

    public async Task<User> GetUserData()
    {

        if(!_currentUser.IsAuthenticated) throw new Exception("User is not logged in!");

        var user = await _userRepository.GetUserAsync(_currentUser.Id!.Value);

        if (user is null) throw new Exception("User not found.");

        return user;
    }
    
}