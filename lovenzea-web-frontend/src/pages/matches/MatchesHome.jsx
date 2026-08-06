export default function MatchesHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-[#666]">Matches</h1>

      <p className="max-w-[760px] text-sm leading-6 text-[#666]">
        Here, you can view matching Profiles based on criteria specified by you in your partner
        requirements. You can set up to 20 different criteria like Age, Height, Community, Education,
        etc and get the best matches!
      </p>

      <p className="text-sm font-semibold text-[#d40000]">
        To use this section, register or login.
      </p>

      <ul className="list-disc space-y-2 pl-5 text-sm text-[#666]">
        <li>
          <span className="font-semibold">Existing member?</span>{" "}
          <a className="text-[#2a6db0] hover:underline" href="#">
            Login and start communicating now »
          </a>
        </li>
        <li>
          <span className="font-semibold">Not a LovenZea.com member?</span>
        </li>
      </ul>

      <div className="pt-2">
        <div className="text-xs text-[#888]">Express Interest FREE</div>
        <button className="mt-2 rounded bg-[#10a6b0] px-8 py-2 text-sm font-bold text-white hover:opacity-95">
          Register Now
        </button>
        <div className="mt-2 text-xs">
          <a href="#" className="text-[#2a6db0] hover:underline">
            Why join?
          </a>
        </div>
      </div>
    </div>
  );
}
