namespace ApnaNest.Data.Entities;

public class Lead
{
    public Guid Id { get; set; }
    public Guid PropertyId { get; set; }
    public Guid OwnerId { get; set; }
    public string BuyerName { get; set; } = string.Empty;
    public string BuyerPhone { get; set; } = string.Empty;
    public string? BuyerEmail { get; set; }
    public string? Message { get; set; }
    public short StatusId { get; set; } = 1;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Enriched data
    public string? PropertyTitle { get; set; }
}
