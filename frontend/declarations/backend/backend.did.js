export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'calculate' : IDL.Func(
        [IDL.Float64, IDL.Float64, IDL.Text],
        [IDL.Opt(IDL.Float64)],
        [],
      ),
    'clear' : IDL.Func([], [], []),
    'getResult' : IDL.Func([], [IDL.Float64], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
