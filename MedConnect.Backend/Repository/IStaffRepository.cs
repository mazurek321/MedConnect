using MedConnect.Backend.Models;

namespace MedConnect.Backend.Repository;
public interface IStaffRepository
{
    Task<Staff?> GetByIdAsync(Guid id);
    Task AddAsync(Staff staff);
}