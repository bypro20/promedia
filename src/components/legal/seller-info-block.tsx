import { LEGAL } from '@/lib/legal-config'
import { SITE } from '@/lib/site-config'

export function SellerInfoBlock() {
  const rows: Array<[string, string]> = [
    ['Ticari Unvan', LEGAL.companyName],
    ['Marka / Site', `${LEGAL.tradeName} (${LEGAL.domain})`],
    ['Adres', LEGAL.address],
    ['Telefon', SITE.phone],
    ['E-posta', SITE.email],
    ['MERSİS No', LEGAL.mersisNo],
    ['Vergi Dairesi', LEGAL.taxOffice],
    ['Vergi No', LEGAL.taxNo],
  ]
  if (LEGAL.kepmail) rows.push(['KEP Adresi', LEGAL.kepmail])

  return (
    <div className="not-prose overflow-hidden rounded-2xl border border-[#E9EBF5] bg-white shadow-sm">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-[#E9EBF5] last:border-0">
              <th className="w-36 bg-[#F0F1F9] px-4 py-3 text-left text-xs font-bold uppercase text-[#666F94]">{label}</th>
              <td className="px-4 py-3 font-medium text-[#33353E]">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
