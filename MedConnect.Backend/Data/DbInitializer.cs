using MedConnect.Backend.Data;
using MedConnect.Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public static class DbInitializer
{
    public static async Task SeedAdminAsync(AppDbContext db, IConfiguration configuration)
    {
        var adminExists = await db.Users.AnyAsync(u => u.Role == UserRole.Admin);

        if (!adminExists)
        {
            var adminUsername = configuration["InitialAdmin:Username"] ?? "admin";
            var adminPassword = configuration["InitialAdmin:Password"] ?? "FallbackHasloWStosunkuDoDocker";

            var defaultAdmin = Staff.CreateAccount(
                username: adminUsername, 
                name: "System", 
                lastname: "Administrator", 
                plainPassword: adminPassword, 
                role: UserRole.Admin, 
                medicalLicenseNumber: "ADMIN-000"
            );

            await db.Users.AddAsync(defaultAdmin);
            await db.SaveChangesAsync();
        }
    }
}