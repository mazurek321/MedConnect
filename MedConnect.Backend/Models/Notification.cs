using System.ComponentModel.DataAnnotations;

namespace MedConnect.Backend.Models;

public class Notification
{
    public Notification(){}

    private Notification(Guid id, string topic, string message, AlertType type, DateTime createdAt, UserRole reciptientRole)
    {
        Id = id;
        Topic = topic;
        Message = message;
        Type = type;
        CreatedAt = createdAt;
        ReciptientRole = reciptientRole;
    }

    [Key]
    public Guid Id { get; private set; }
    public string Topic { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public AlertType Type { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public UserRole ReciptientRole { get; private set; }


    public static Notification NewNotification(
        string topic, string message, AlertType type, UserRole reciptientRole
    )
    {
        return new Notification(Guid.NewGuid(), topic, message, type, DateTime.UtcNow, reciptientRole);
    }
}