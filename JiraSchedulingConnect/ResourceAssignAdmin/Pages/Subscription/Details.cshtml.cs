﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace ResourceAssignAdmin.Pages.Subscription
{
    public class DetailsModel : PageModel
    {
        private readonly ModelLibrary.DBModels.WoTaasContext _context;

        public DetailsModel(ModelLibrary.DBModels.WoTaasContext context)
        {
            _context = context;
        }

        public ModelLibrary.DBModels.Subscription Subscription { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.Subscriptions == null)
            {
                return NotFound();
            }

            var subscription = await _context.Subscriptions.FirstOrDefaultAsync(m => m.Id == id);
            if (subscription == null)
            {
                return NotFound();
            }
            else
            {
                Subscription = subscription;
            }
            return Page();
        }
    }
}
