using MedConnect.Backend.Models;

namespace MedConnect.Backend.Repository;

public interface IUserRepository
{
   Task<User?> GetByUsernameAsync(string username);
   Task AddAsync(User user);
   Task<User?> GetUserAsync(Guid id);
}