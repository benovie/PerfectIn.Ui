<?php

namespace PerfectIn\Ui\Command;

use TYPO3\Flow\Annotations as Flow;

class UiCommandController extends \TYPO3\Flow\Cli\CommandController {
	

	/**
	 * @var \PerfectIn\Ui\Service\PresentationService
	 * @Flow\Inject
	 */
	protected $presentationService;
	
	/**
	 * create presentation
	 * 
	 * @param string $module
	 * @param string $name
	 */
	public function createCommand($module, $name) {
		$this->presentationService->createPresentation($module, $name);
		$this->outputLine('Presentation: '.$module.'-'.$name.'  is created');
	}
	
	
	/**
	 * create api
	 *
	 */
	public function apiCommand() {
		$apiLocation = $this->presentationService->createApi();
		$this->outputLine('Api published in: '.$apiLocation);
	}
}