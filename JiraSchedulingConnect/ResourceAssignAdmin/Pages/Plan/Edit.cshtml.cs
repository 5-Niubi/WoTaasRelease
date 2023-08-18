﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ModelLibrary.DBModels;

namespace ResourceAssignAdmin.Pages.Plan
{
    public class EditModel : PageModel
    {
        private readonly ModelLibrary.DBModels.WoTaasContext _context;

        public EditModel(ModelLibrary.DBModels.WoTaasContext context)
        {
            _context = context;
        }

        [BindProperty]
        public PlanSubscription PlanSubscription { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.PlanSubscriptions == null)
            {
                return NotFound();
            }

            var plansubscription = await _context.PlanSubscriptions.FirstOrDefaultAsync(m => m.Id == id);
            if (plansubscription == null)
            {
                return NotFound();
            }
            PlanSubscription = plansubscription;
            return Page();
        }

        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var plansubscription = await _context.PlanSubscriptions
                .FirstOrDefaultAsync(m => m.Id == PlanSubscription.Id);

            plansubscription.Id = PlanSubscription.Id;
            plansubscription.Name = PlanSubscription.Name;
            plansubscription.Price = PlanSubscription.Price;
            plansubscription.Duration = PlanSubscription.Duration;

            _context.PlanSubscriptions.Update(plansubscription);

            await _context.SaveChangesAsync();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlanSubscriptionExists(PlanSubscription.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return RedirectToPage("./Index");
        }

        private bool PlanSubscriptionExists(int id)
        {
            return (_context.PlanSubscriptions?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
