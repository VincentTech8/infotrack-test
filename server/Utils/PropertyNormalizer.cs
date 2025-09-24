using Server.Models;

namespace Server.Utils
{
    public static class PropertyUtils
    {
        public static InternalProperty NormalizeProperty(ExternalProperty p)
        {
            var fullAddress = !string.IsNullOrWhiteSpace(p.formattedAddress)
                ? p.formattedAddress
                : $"{p.addressParts?.street} {p.addressParts?.suburb} {p.addressParts?.state} {p.addressParts?.postcode}"
                  .Replace("  ", " ").Trim();

            var hasVolFolio = !string.IsNullOrWhiteSpace(p.title?.volume) && !string.IsNullOrWhiteSpace(p.title?.folio);

            return new InternalProperty(
                fullAddress,
                p.lotPlan,
                new VolumeFolio(
                    string.IsNullOrWhiteSpace(p.title?.volume) ? null : p.title?.volume,
                    string.IsNullOrWhiteSpace(p.title?.folio) ? null : p.title?.folio
                ),
                hasVolFolio ? "KnownVolFol" : "UnknownVolFol",
                new SourceTrace(p.provider, p.requestId, p.receivedAt ?? DateTimeOffset.MinValue)
            );
        }
    }
}
