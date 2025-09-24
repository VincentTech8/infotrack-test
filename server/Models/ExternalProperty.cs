namespace Server.Models
{
    public record AddressParts(string? street, string? suburb, string? state, string? postcode);
    public record LotPlan(string? lot, string? plan);
    public record Title(string? volume, string? folio);

    public record ExternalProperty(
        string? provider,
        string? requestId,
        DateTimeOffset? receivedAt,
        AddressParts? addressParts,
        string? formattedAddress,
        LotPlan? lotPlan,
        Title? title
    );
}
