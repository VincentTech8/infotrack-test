using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Utils;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/property")]
    public class PropertyController : ControllerBase
    {
        [HttpPost("normalize")]
        public IActionResult Normalize([FromBody] ExternalProperty property)
        {
            // Check if the property is null or invalid
            if (property == null)
            {
                return BadRequest("Property cannot be null.");
            }

            var result = PropertyUtils.NormalizeProperty(property);
            return Ok(result);
        }
    }
}
