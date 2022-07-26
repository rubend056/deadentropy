import schema from "."
import va from "../../validate"

const c = va.compile(schema)

test("Note", () => {
  expect(
    c({
      note: {
        value: "Testing"
      },
    })
  ).toBe(true)

  expect(
    c({
      note: {
        value: 3
      },
    })
  ).toBe(false)
})
