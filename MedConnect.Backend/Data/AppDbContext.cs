using Microsoft.EntityFrameworkCore;
using MedConnect.Backend.Models;

namespace MedConnect.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Patient> Patients => Set<Patient>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasDiscriminator<string>("UserType")
                .HasValue<User>("User")
                .HasValue<Staff>("Staff");

            entity.Property(u => u.Role)
                  .HasConversion<string>()
                  .UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.OwnsOne(p => p.Vitals, v =>
            {
                v.Property(x => x.HeartRate).UsePropertyAccessMode(PropertyAccessMode.Field);
                v.Property(x => x.SystolicBloodPressure).UsePropertyAccessMode(PropertyAccessMode.Field);
                v.Property(x => x.DiastolicBloodPressure).UsePropertyAccessMode(PropertyAccessMode.Field);
                v.Property(x => x.OxygenSaturation).UsePropertyAccessMode(PropertyAccessMode.Field);
                v.Property(x => x.Temperature).UsePropertyAccessMode(PropertyAccessMode.Field);
            });

            entity.Property(p => p.Name).UsePropertyAccessMode(PropertyAccessMode.Field);
            entity.Property(p => p.Lastname).UsePropertyAccessMode(PropertyAccessMode.Field);
            entity.Property(p => p.Pesel).UsePropertyAccessMode(PropertyAccessMode.Field);
            
        });
    }
}