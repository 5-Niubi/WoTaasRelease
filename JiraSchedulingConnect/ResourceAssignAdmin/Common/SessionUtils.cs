﻿using BC = BCrypt.Net.BCrypt;

namespace ResourceAssignAdmin.Common
{
    public class SessionUtils
    {
        public static void AddCookies(string key, string value, int minute, HttpContext context)
        {
            CookieOptions options = new()
            {
                MaxAge = TimeSpan.FromMinutes(minute),
            };
            context.Response.Cookies.Append(key, value, options);
        }

        //public static Dictionary<int, OrderDetail> GetCartInfo(HttpContext context)
        //{
        //    string cart = context.Request.Cookies["Cart"];
        //    if (cart == null)
        //    {
        //        return new Dictionary<int, OrderDetail>();
        //    }
        //    else
        //    {
        //        return JsonSerializer.Deserialize<Dictionary<int, OrderDetail>>(cart);
        //    }
        //}

        //public static Account GetAccountFromSession(ISession session)
        //{
        //    string accountString = session.GetString("CustSession");
        //    if (accountString != null)
        //    {
        //        return JsonSerializer.Deserialize<Account>(accountString);
        //    }
        //    return null;
        //}

        //public static bool isAdminSession(ISession session)
        //{
        //    return isAdmin(GetAccountFromSession(session));
        //}

        //public static bool isAdmin(Account account)
        //{
        //    if (account == null)
        //    {
        //        return false;
        //    }
        //    return account.Role == 1;
        //}


        //public static string EncodeJWTToken(Account account)
        //{
        //    var builder = WebApplication.CreateBuilder();
        //    var key = Encoding.ASCII.GetBytes
        //    (builder.Configuration["Jwt:Key"]);
        //    var tokenDescriptor = new SecurityTokenDescriptor
        //    {
        //        Subject = new ClaimsIdentity(new[]
        //        {
        //        new Claim(Const.JWT_KEY.ID, Guid.NewGuid().ToString()),
        //        new Claim(Const.JWT_KEY.SUB, account.AccountId.ToString()),
        //        new Claim(Const.JWT_KEY.EMAIL, account.Email),
        //        new Claim(JwtRegisteredClaimNames.Jti,
        //        Guid.NewGuid().ToString())
        //     }),
        //        Expires = DateTime.UtcNow.AddMinutes(1),
        //        SigningCredentials = new SigningCredentials
        //        (new SymmetricSecurityKey(key),
        //        SecurityAlgorithms.HmacSha512Signature)
        //    };
        //    var tokenHandler = new JwtSecurityTokenHandler();
        //    var token = tokenHandler.CreateToken(tokenDescriptor);
        //    var stringToken = tokenHandler.WriteToken(token);
        //    return stringToken;
        //}

        //public static Dictionary<string, string> DecodeJWTTokenGetName(string token)
        //{
        //    {
        //        var builder = WebApplication.CreateBuilder();
        //        var key = Encoding.ASCII.GetBytes
        //            (builder.Configuration["Jwt:Key"]);
        //        var handler = new JwtSecurityTokenHandler();
        //        var validations = new TokenValidationParameters
        //        {
        //            ValidateIssuerSigningKey = true,
        //            IssuerSigningKey = new SymmetricSecurityKey(key),
        //            ValidateIssuer = false,
        //            ValidateAudience = false
        //        };
        //        var claims = handler.ValidateToken(token, validations, out var tokenSecure);
        //        Dictionary<string, string> dicClaims = claims.Claims.ToDictionary(x => x.Type, x => x.Value);
        //        return dicClaims;
        //    }
        //}


        public static class PasswordUtils
        {
            public static string PasswordHasher(string plainPassword)
            {
                return BC.HashPassword(plainPassword, BC.GenerateSalt(), false, BCrypt.Net.HashType.SHA256);
            }

            public static bool PasswordCompare(string plainPassword, string hashPassword)
            {
                return BC.Verify(plainPassword, hashPassword, false, BCrypt.Net.HashType.SHA256);
            }
        }
    }
}
