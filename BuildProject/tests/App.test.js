import wd from 'wd'
import { retry } from './retry.js'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000
const TEST_PLATFORM = process.env.TEST_PLATFORM
const PORT = 4723

const config =
  (TEST_PLATFORM == 'ios') ? {
    platformName: "iOS",
    platformVersion: "14.4",
    deviceName: "iPhone 11",
    app: "build/BuildProject.ipa",
    automationName: "XCUITest",
  } :
  (TEST_PLATFORM == 'android') ? {
    platformName: "Android",
    deviceName: "Android Emulator",
    app: "build/app-release.apk",
  } :
  null

const driver = wd.promiseChainRemote('localhost', PORT)

beforeAll(async () => {
  if (config == null) fail(`Unknown TEST_PLATFORM: ${TEST_PLATFORM}`)
  await driver.init(config)
})

test(`Test All Promoted Logging Calls (${TEST_PLATFORM})`, async () => {

  class EmptyResultTextError extends Error {
    constructor() {
      super('Test produced no result text')
      this.name = 'EmptyResultTextError'
    }
  }

  await retry(async () => {
    const messagesText = await driver.elementByAccessibilityId('messages-text')
    const s = await messagesText.text()
    // Text not yet available. Cause a retry (or failure).
    if (!s) throw new EmptyResultTextError()
    // Text is available. Check that it contains what we expect.
    if (!s.endsWith('All hooks passed')) fail(s)
  }, /*errorClassesToIgnore=*/[EmptyResultTextError], driver)

  await retry(async () => {
    const testAllButton = await driver.elementByAccessibilityId('test-all-button')
    await driver.tapElement(testAllButton)
    const messagesText = await driver.elementByAccessibilityId('messages-text')
    const s = await messagesText.text()
    // Text not yet available. Cause a retry (or failure).
    if (!s) throw new EmptyResultTextError()
    // Text is available. Check that it contains what we expect.
    if (!s.endsWith('All logging passed')) fail(s)
  }, /*errorClassesToIgnore=*/[EmptyResultTextError], driver)
})
