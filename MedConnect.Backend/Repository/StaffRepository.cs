using MedConnect.Backend.Data;
using MedConnect.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace MedConnect.Backend.Repository;

public class StaffRepository : IStaffRepository
{
    private readonly AppDbContext _context;

    public StaffRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Staff?> GetByIdAsync(Guid id)
    {
        return await _context.StaffMembers.FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task AddAsync(Staff staff)
    {
        _context.StaffMembers.Add(staff);
        await _context.SaveChangesAsync();
    }
}