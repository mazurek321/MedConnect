using MedConnect.Backend.Models;
using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;

namespace MedConnect.Backend.GraphQL;

public class Subscription
{
    [Subscribe]
    [Topic("Notifications_For_{role}")]
    public Notification OnNotificationReceived(
        [EventMessage] Notification notification)
    {
        return notification;
    }

    [Subscribe]
    [Topic(nameof(Subscription.OnPatientUpdated))]
    public Patient OnPatientUpdated([EventMessage] Patient patient)
    {
        Console.WriteLine("UPDATE PATIENT SUBSCRIPTION");
        return patient;
    }
}