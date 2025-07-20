from sys import exit
from threading import Semaphore
from pathlib import Path
from colorama import Fore, Style
import frida


ROOT = Path(__file__).resolve().parent.parent


class TestRunner:
    AGENT_PATH = ROOT / "test" / "agent.js"
    DIST_PATH = ROOT / "dist" / "index.js"

    def __init__(self, build_path: Path) -> None:
        self.lock = Semaphore(0)
        self.unity_version = build_path.name
        self.passed = []
        self.failed = []
        self.host = frida.spawn([str(ROOT / "build" / "host"), str(build_path / "out")])

    def prepare(self) -> None:
        session = frida.attach(self.host)

        # Combine the main IL2CPP bridge with the test agent, just like the Node.js version
        dist_code = self.DIST_PATH.read_text(encoding="utf-8")
        agent_code = self.AGENT_PATH.read_text(encoding="utf-8")

        self.script = session.create_script(
            source=f'{dist_code}\n{agent_code}\nconst $EXPECTED_UNITY_VERSION = "{self.unity_version}";',
            name=self.unity_version,
        )
        self.script.on("message", self.on_message)
        self.script.load()

    def run(self) -> None:
        frida.resume(self.host)
        if not self.lock.acquire(timeout=10):
            self.stop()
            raise RuntimeError(f"Timed out when running tests for {self.unity_version}")

    def stop(self) -> None:
        self.lock.release()
        self.script.unload()
        frida.kill(self.host)

    def on_message(self, message: frida.core.ScriptMessage, _):
        if message["type"] == "send" and (payload := message.get("payload")):
            if payload.get("type") == "summary":
                self.passed = [
                    {"name": f"Test {i+1}"} for i in range(payload.get("passed", 0))
                ]
                self.failed = [
                    {"name": f"Test {i+1}", "exception": "Failed"}
                    for i in range(payload.get("failed", 0))
                ]
                self.stop()
            else:
                # Handle individual test messages (for debugging)
                print(f"  {payload}")


def main() -> int:
    passed_count = 0
    failed_count = 0

    for build_path in (ROOT / "build").iterdir():
        if not build_path.is_dir():
            continue

        test_runner = TestRunner(build_path=build_path)
        test_runner.prepare()
        print(f"{Fore.BLUE}►{Style.RESET_ALL} {test_runner.unity_version}")

        try:
            test_runner.run()

            for passed in test_runner.passed:
                passed_count += 1
                print(f"  {Fore.GREEN}✓ {passed['name']}{Style.RESET_ALL}")
            for failed in test_runner.failed:
                failed_count += 1
                error_msg = failed.get("exception", "Failed")
                print(
                    f"  {Fore.RED}𐄂 {failed['name']}: {str(error_msg)}{Style.RESET_ALL}"
                )
        except Exception as e:
            failed_count += 1
            print(f"  {Fore.RED}𐄂 Failed to run tests: {str(e)}{Style.RESET_ALL}")
        finally:
            try:
                test_runner.stop()
            except:
                pass

    print()  # Empty line for readability
    if failed_count > 0:
        print(f"{Fore.RED}𐄂{Style.RESET_ALL} {failed_count} test(s) failed")
        return 1
    else:
        print(f"{Fore.BLUE}✓{Style.RESET_ALL} {passed_count} test(s) passed")
        return 0


if __name__ == "__main__":
    exit(main())
