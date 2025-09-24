namespace Server.Models
{
    public record VolumeFolio(string? volume, string? folio);
    public record SourceTrace(string? provider, string? requestId, DateTimeOffset? receivedAt);

    public record InternalProperty(
        string fullAddress,
        LotPlan? lotPlan,
        VolumeFolio volumeFolio,
        string status,
        SourceTrace sourceTrace
    );
}
