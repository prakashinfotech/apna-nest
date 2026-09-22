using System.Data;

namespace ApnaNest.Data.Factories;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}
