package fi.vm.sade;

import fi.vm.sade.integrationtest.util.PortChecker;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import static org.junit.Assert.*;

public class HakulomakkeenhallintaUiMochaTest {

    @Test
    public void runMochaTests() {
        int port =  PortChecker.findFreeLocalPort();
        int ajpPort =  PortChecker.findFreeLocalPort();
        System.setProperty("spring.profiles.active", "it");
        final HakulomakkeenhallintaUiTomcat tomcat = new HakulomakkeenhallintaUiTomcat(port, ajpPort);
        tomcat.start();

        String testCommand = "node_modules/mocha-phantomjs/bin/mocha-phantomjs -R spec http://localhost:" + port + "/test/runner.html";
        int exitValue = execCommand(testCommand);
        System.out.println("Starting mocha tests...");
        assertEquals(exitValue, 0);
    }

    private int execCommand(String command) {
        try {
            Runtime r = Runtime.getRuntime();
            Process p = r.exec(command);
            p.waitFor();
            printProcessOutput(p);
            return p.exitValue();
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    private void printProcessOutput(Process p) throws IOException {
        InputStream is = p.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String s = null;
        while ((s = reader.readLine()) != null) System.out.println(s);
        is.close();
    }
}
