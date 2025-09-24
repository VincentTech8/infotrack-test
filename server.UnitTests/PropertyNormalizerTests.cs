using System;
using Xunit;
using Server.Models;
using Server.Utils;

namespace Server.Tests
{
    public class PropertyUtilsTests
    {
        [Fact]
        public void NormalizeProperty_KnownVolFolio_ReturnsKnownStatus()
        {
            var external = new ExternalProperty(
                provider: "VIC-DDP",
                requestId: "REQ-123",
                receivedAt: DateTimeOffset.UtcNow,
                addressParts: new AddressParts("10 Example St", "Carlton", "VIC", "3053"),
                formattedAddress: "10 Example St, Carlton VIC 3053",
                lotPlan: new LotPlan("12", "PS123456"),
                title: new Title("123", "456")
            );

            var result = PropertyUtils.NormalizeProperty(external);

            Assert.Equal("KnownVolFol", result.status);
            Assert.Equal("123", result.volumeFolio.volume);
            Assert.Equal("456", result.volumeFolio.folio);
        }

        [Fact]
        public void NormalizeProperty_UnknownVolFolio_ReturnsUnknownStatus()
        {
            var external = new ExternalProperty(
                provider: "VIC-DDP",
                requestId: "REQ-456",
                receivedAt: DateTimeOffset.UtcNow,
                addressParts: new AddressParts("5 Example Rd", "Melbourne", "VIC", "3000"),
                formattedAddress: null,
                lotPlan: new LotPlan("34", "LP98765"),
                title: new Title(null, null)
            );

            var result = PropertyUtils.NormalizeProperty(external);

            Assert.Equal("UnknownVolFol", result.status);
            Assert.Null(result.volumeFolio.volume);
            Assert.Null(result.volumeFolio.folio);
        }

        [Fact]
        public void NormalizeProperty_ComposesAddress_WhenFormattedAddressMissing()
        {
            var external = new ExternalProperty(
                provider: "VIC-DDP",
                requestId: "REQ-789",
                receivedAt: DateTimeOffset.UtcNow,
                addressParts: new AddressParts("1 Example Ave", "Brunswick", "VIC", "3056"),
                formattedAddress: null,
                lotPlan: null,
                title: new Title("321", "654")
            );

            var result = PropertyUtils.NormalizeProperty(external);

            Assert.Equal("1 Example Ave Brunswick VIC 3056", result.fullAddress);
        }

        [Fact]
        public void NormalizeProperty_PreservesSourceTrace()
        {
            var external = new ExternalProperty(
                provider: "VIC-DDP",
                requestId: "REQ-999",
                receivedAt: DateTimeOffset.UtcNow,
                addressParts: null,
                formattedAddress: null,
                lotPlan: null,
                title: new Title(null, null)
            );

            var result = PropertyUtils.NormalizeProperty(external);

            Assert.Equal(external.provider, result.sourceTrace.provider);
            Assert.Equal(external.requestId, result.sourceTrace.requestId);
            Assert.Equal(external.receivedAt, result.sourceTrace.receivedAt);
        }
    }
}
