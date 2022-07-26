import {vad as va} from "."

test("Note", () => {
  expect(
    va.note({
      value: "Testing",
    })
  ).toBe(true)

  expect(
    va.note({
      value: 3,
    })
  ).toBe(false)
})
